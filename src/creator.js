console.log("creator js");
const SortItOut = angular.module("SortItOutCreator", ['ngMaterial', 'ngMessages']);

SortItOut.config( ($mdThemingProvider) =>
	$mdThemingProvider.theme('toolbar-dark', 'default').primaryPalette('indigo').dark()
);

SortItOut.controller("SortItOutController", ($scope, $mdDialog) => {

	$scope.MAX_ITEM_LENGTH = 30;
	$scope.MAX_NUM_BUCKETS = 4;

	$scope.buckets = [
		{
			name: "bucket 1",
			items: [
				{ text: "number 1" },
				{ text: "number 2" },
				{ text: "number 3" }
			]
		},
		{
			name: "bucket 2",
			items: [
				{ text: "number 4" },
				{ text: "number 5" },
				{ text: "number 6" }
			]
		},
		{
			name: "bucket 3 is has max len of 35 chars",
			items: [
				{ text: "number 7" },
				{ text: "number 8" },
				{ text: "number 9" },
				{ text: "number 10" },
				{ text: "number 11" }
			]
		}
	];
	$scope.editBucketIndex = 0;

	$scope.initNewWidget = (widget) => {
		console.log("initNewWidget");
		$scope.title = "My Sort-It-Out Widget";
		$scope.$apply();
	};

	$scope.initExistingWidget = (title, widget, qset) => {
		console.log("initExistingWidget");
		$scope.title = title;
		$scope.qset = qset;
		$scope.$apply();
	};

	$scope.addItem = (bucketIndex) => {
		$scope.buckets[bucketIndex].items.push( { text: "" } );
	};

	$scope.addBucket = () => {
		$scope.buckets.push({
			name: "",
			items: [
				{ text: "" }
			]
		});
	};

	$scope.canAddBucket = () => {
		return $scope.buckets.length < $scope.MAX_NUM_BUCKETS;
	};

	$scope.validBucket = (bucketIndex) => {
		for (let item of $scope.buckets[bucketIndex].items) {
			const validLength = (
				item.text &&
				item.text.length &&
				item.text.length < $scope.MAX_ITEM_LENGTH
			);
			if (!validLength) {
				return false;
			}
		}
		return true;
	};

	const allUnique = () => {
		let uniqueItems = {};
		let uniqueBucketNames = {};

		for (let bucket of $scope.buckets) {
			if (uniqueBucketNames[bucket.name]) {
				return false;
			}
			uniqueBucketNames[bucket.name] = true;

			for (let item of bucket.items) {
				if (uniqueItems[item.text]) {
					return false;
				}
				uniqueItems[item.text] = true;
			}
		}
		return true;
	};

	const getSaveError = () => {
		if (!allUnique()) {
			return "all bucket names and items must be unique";
		}

		for (let i = 0; i < $scope.buckets.length; i++) {
			if (!$scope.validBucket(i)) {
				const bucketName = $scope.buckets[i].name;
				return `bucket "${bucketName}" contains an invalid item`;
			}
		}
		return false;
	};

	$scope.showEditDialog = (ev, bucketIndex) => {
		$scope.editBucketIndex = bucketIndex;
		$mdDialog.show({
			contentElement: "#edit-dialog-container",
			parent: angular.element(document.body),
			targetEvent: ev,
			clickOutsideToClose: true,
			openFrom: ev.currentTarget,
			closeTo: ev.currentTarget
		});
	};

	$scope.showConfirmDelete = (ev) => {
		const confirm = $mdDialog.confirm()
			.title("Are you sure you want to delete this bucket?")
			.textContent("This will delete all items in this bucket as well.")
			.ariaLabel("Bucket Delete Confirm")
			.targetEvent(ev)
			.ok("Delete")
			.cancel("Cancel");
		$mdDialog.show(confirm).then(
			() => deleteBucket(),
			() => null
		);
	}

	const deleteBucket = () => {
		console.log("deleting bucket ", $scope.editBucketIndex);
		$scope.buckets.splice($scope.editBucketIndex, 1);
	}

	$scope.onSaveClicked = () => {
		console.log("onSaveClicked");
		const saveError = getSaveError();
		console.log("save error: ", saveError);
		if (saveError) {
			Materia.CreatorCore.cancelSave(saveError);
		}
		else {
			Materia.CreatorCore.save($scope.title, $scope.qset);
		}
	};

	$scope.onQuestionImportComplete = (items) => {
		console.log("onQuestionImportComplete");
		// TODO
		return true;
	};

	$scope.onSaveComplete = () => {
		console.log("onSaveComplete");
		// TODO
		return true;
	};

	Materia.CreatorCore.start($scope);
});

/* TODO
SortItOut.factory("Resource", () => {
	{
		buildQset: ( ... ) => {
			// TODO
		},

		processQsetItem: () => {
			// TODO
		}
	}
})
*/
